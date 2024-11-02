import Joi, { ObjectSchema } from "joi";

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
}

export class Validation {
  private validateSchema<T>(schema: ObjectSchema<T>, data: T): void {
    const { error } = schema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `Erro de validação: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`
      );
    }
  }
  public validateUserCreation(data: UserCreationAttributes) {
    const userCreationSchema = Joi.object<UserCreationAttributes>({
      name: Joi.string().min(3).max(30).required().messages({
        "string.empty": "O nome é obrigatório",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "O e-mail é obrigatório",
        "string.email": "O e-mail é inválido",
      }),

      password: Joi.string().min(6).required().messages({
        "string.empty": "A senha é obrigatória",
      }),
    });

    this.validateSchema(userCreationSchema, data);
  }
}
