import { ZodObject } from "zod";


export const SchemaValidator = <T extends ZodObject<any>>(schema: T, data: any):{msg:string,path:string}[] | boolean => {
    const validate = schema.safeParse(data)

    let errors: {msg:string,path:string}[] = []

    if (!validate.success) {
        validate.error.issues.map((issue) => {
            errors.push({msg: issue.message, path: issue.path.join(".")})
        })
        return errors
    }
    return true
}