import { userRegisterSchema } from '@/lib/zodSchema'
import React from 'react'
import { z } from 'zod'

export type FormRegistrationValues = z.infer<typeof userRegisterSchema>

const RegisterForm = () => {
  return (
    <div>
      
    </div>
  )
}

export default RegisterForm
