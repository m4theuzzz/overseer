import { useState } from 'react'
import Joi from 'joi'

export function useForm(initialFValues, validations) {
  const [values, setValues] = useState(initialFValues)
  const [errors, setErrors] = useState({})

  function getFieldErrors(objError) {
    const errorsRes = {}

    if (objError.error) {
      objError.error.details.forEach(err => {
        errorsRes[err.path.join('.')] = err.message
      })
    }

    return errorsRes
  }

  const resetForm = () => {
    setValues(initialFValues)
    setErrors({})
  }

  const formValidate = () => {
    setErrors({})
    const schema = Joi.object(validations)

    const formErrors = getFieldErrors(schema.validate(values, { abortEarly: false, allowUnknown: true }))

    if (Object.keys(formErrors).length != 0) {
      setErrors(formErrors)

      return true // has error
    }

    return null
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    resetForm,
    formValidate
  }
}
