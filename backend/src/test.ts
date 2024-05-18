import { v4 } from "uuid";
import server from "./api";
import supertest from "supertest";
import { Folder } from "@prisma/client";
import defaults from "superagent-defaults";

const request = defaults(supertest(server));

const email = `${v4()}@gmail.com`;
const password = v4();
let accessToken = "";
let refreshToken = "";
let folderId = "";

describe("Authentication", () => {
  it("Register", async () => {
    const res = await request.post("/register").send({
      email,
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toHaveProperty("id");
  });

  it("Login", async () => {
    const res = await request.post("/login").send({
      email,
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toHaveProperty("id");

    accessToken = `Bearer ${res.body.accessToken}`;
    refreshToken = `Bearer ${res.body.refreshToken}`;

    // For the accessToken test below
    request.set({
      Authorization: refreshToken,
    });
  });

  it("Regenerate access token", async () => {
    const res = await request.get("/accessToken");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("accessToken");

    accessToken = `Bearer ${res.body.accessToken}`;

    request.set({
      Authorization: accessToken,
    });
  });
});

describe("Profiles", () => {
  it("Fetch self data", async () => {
    const res = await request.get("/me");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));

    const profileData = res.body.profileData;

    expect(profileData).toBeDefined();

    expect(profileData.createdAt).toBeDefined();
  });
});

describe("Filesystem", () => {
  it("Get home folders", async () => {
    const res = await request.get("/folders");

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("folders");
  });

  it("Create folder", async () => {
    const res = await request.post("/folders").send({
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
      title: "Test folder renamed",
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });

  it("Get folder files", async () => {
    const res = await request.get(`/files/${folderId}`);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("files");
  });

  it("Delete folder", async () => {
    const res = await request.delete(`/folders/${folderId}`);

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });
});

describe("Finalise", () => {
  it("Delete account", async () => {
    const res = await request.delete("/login").send({
      password,
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(res.body).toHaveProperty("success");
  });
});
