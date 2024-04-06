export async function POST(request: Request) {
  const req = await request.json();

  const apiURL = process.env.LITESTORE_API_URL;

  // Verify token
  const tokenRes = await fetch(`${apiURL}/loginToken`, {
    method: "POST",
    body: JSON.stringify({
      token: req.token,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  if (tokenRes.status != 200) {
    return Response.json({ failure: "Invalid token" });
  }

  return Response.json({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
  });
}
