import { v4 } from "uuid";
import server from "./api";
import supertest from "supertest";
import { Folder } from "@prisma/client";

const request = supertest(server);

const identifier = v4().replace(/-/, "").substring(0, 10);
const email = `${v4()}@gmail.com`;
const password = v4();
let token = "";
let folderId = "";

describe("Authentication", () => {
  it("Register", async () => {
    const res = await request.post("/register").send({
      identifier,
      email,
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("Login", async () => {
    const res = await request.post("/login").send({
      email,
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("token");
  });
});

describe("Profiles", () => {
  it("Fetch self identifier", async () => {
    const res = await request.get("/me").set("Authorization", token);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("identifier");
    expect(res.body.identifier).toEqual(identifier);
  });

  it("Fetch profile data", async () => {
    const res = await request
      .get(`/user/${identifier}`)
      .set("Authorization", token);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));

    const profileData = res.body.profileData;

    expect(profileData).toBeDefined();

    expect(profileData.identifier).toEqual(identifier);
    expect(profileData.createdAt).toBeDefined();
  });
});

describe("Filesystem", () => {
  it("Get home folders", async () => {
    const res = await request.get("/folders").set("Authorization", token);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("folders");
  });

  it("Create folder", async () => {
    const res = await request.post("/folders").send({
      token,
      title: "Test folder",
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("folder");

    const folder: Folder = res.body.folder;

    folderId = folder.folderId;
  });

  it("Rename folder", async () => {
    const res = await request.post(`/folders/rename/${folderId}`).send({
      token,
      title: "Test folder renamed",
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });

  it("Get folder files", async () => {
    const res = await request
      .get(`/files/${folderId}`)
      .set("Authorization", token);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("files");
  });

  it("Delete folder", async () => {
    const res = await request.delete(`/folders/${folderId}`).send({
      token,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });
});

describe("Finalise", () => {
  it("Delete account", async () => {
    const res = await request.delete("/login").send({
      token,
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });
});
