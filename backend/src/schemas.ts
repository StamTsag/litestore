import { EzierValidatorStringSchema } from "@ezier/validate";

export const identifierSchema: { identifier: EzierValidatorStringSchema } = {
  identifier: {
    minLength: 3,
    maxLength: 20,
    regex: /[a-zA-Z0-9]+/,
  },
};

export const emailSchema: { email: EzierValidatorStringSchema } = {
  email: {
    type: "email",
  },
};

export const passwordSchema: { password: EzierValidatorStringSchema } = {
  password: {
    minLength: 8,
  },
};

export const folderIdSchema: { folderId: EzierValidatorStringSchema } = {
  folderId: {
    regex: /[a-zA-Z0-9]+/,
  },
};

export const folderTitleSchema: { title: EzierValidatorStringSchema } = {
  title: {
    maxLength: 30,
  },
};

export const fileIdSchema: { fileId: EzierValidatorStringSchema } = {
  fileId: {
    regex: /[a-zA-Z0-9]+/,
  },
};

export const fileNameSchema: { name: EzierValidatorStringSchema } = {
  name: {
    maxLength: 256,
  },
};

export const fileSizeSchema: { size: EzierValidatorStringSchema } = {
  size: {
    regex: /[0-9]+/,
  },
};

export const fileUrlSchema: { url: EzierValidatorStringSchema } = {
  url: {
    regex:
      /https:\/\/ik.imagekit.io\/litestore\/[0-9A-Za-z]{12}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12}\/[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12}\/[a-zA-Z0-9-.?=_]+/,
  },
};

export const fileWidthSchema: { width: EzierValidatorStringSchema } = {
  width: {
    regex: /[0-9]+/,
    optional: true,
  },
};

export const fileHeightSchema: { height: EzierValidatorStringSchema } = {
  height: {
    regex: /[0-9]+/,
    optional: true,
  },
};
