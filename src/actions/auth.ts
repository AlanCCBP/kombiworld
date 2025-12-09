"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { FormState, SignUpFormSchema } from "@/lib/definitions/forms";

type Errors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

type TreefiedErrors = {
  errors: string[];
  properties?: {
    [key: string]: TreefiedErrors;
  };
};

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  const validated = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    const tree = z.treeifyError(validated.error);

    const transformErrors = (tree: TreefiedErrors): Errors => {
      const out: Errors = {};
      if (!tree.properties) return out;

      for (const key of Object.keys(tree.properties)) {
        out[key as keyof Errors] = tree.properties[key].errors;
      }

      return out;
    };

    return {
      errors: transformErrors(tree),
    };
  }

  const { name, email, password } = validated.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  return { errors: {} };
}
