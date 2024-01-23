"use client" 
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"

import {z , ZodType} from "zod"
import { useEffect, useState } from "react"

import Link from "next/link"
import { data } from "autoprefixer"

type RegisterFormType = { 
    nom : string, 
    prenoms : string, 
    email : string, 
    pass : string , 
    confirmPass : string,
    tel : string ,
    country : string , 
    ref : string,
}

const schema : ZodType<RegisterFormType> = z.object({
    nom : z.string().min(3 , {message: "Le nom est requis"}), 
    prenoms : z.string().min(2 , {message: "Le prenom est requis"}), 

    email : z.string().email({
        message : "Un format valide de email est requis"
    }), 

    pass: z
    .string()
    .min(8, { message: "Au moins 8 caractères de long" })
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, {
      message:
        "Un caractère spéciale minimum dans le mot de passe",
    }),
    confirmPass: z.string(),
    tel : z.string().min(8, {message : "Le numéro de telephone est requis"}), 
    country : z.string(), 
    ref : z.string()
}).refine((data) => data.pass === data.confirmPass, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPass"],
})


const RegisterForm = () => {

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false); 
    const [error, setError] = useState(false); 

    const message = toast && ! error ? "Votre inscription effectué" : "Oups Erreur"; 

    const {
        register , 
        handleSubmit, 
        reset , 
        formState : { errors }
    } = useForm<RegisterFormType>({
        resolver : zodResolver(schema)
    })

    const handleFormSubmit = async (data : RegisterFormType) => {

        try {
            setError(false)
            setToast(false)

            const response = await fetch("http://localhost:8000/api/register", {
                method : "POST", 
                headers :{"Content-Type" : "application/json"}, 
                body : JSON.stringify(data)
            }) ; 

            const res = await response.json() ; 

            if(res.status) {
                setToast(true)
            }
            setLoading(false)
            reset() 
        } catch (e) {
            setError(true) ; 
            setToast(true)
        }
    }


    useEffect(() => {
        if(toast) {
            const timer = setTimeout(() => {
                setToast(false)
                setError(false)
            },5000)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [toast])

    return (
        <>
            <div className="font-sans antialiased bg-grey-lightest h-screen">
                <div className="w-full bg-grey-lightest" style={{ paddingTop: "4rem" }}>
                    <div className="container mx-auto py-8">
                    <div className="w-5/6 lg:w-1/2 mx-auto bg-white rounded shadow">
                        {toast && (
                        <div
                            className={`flex justify-between py-4 px-8 ${
                            error
                                ? "bg-[#fad2e1]  text-[#7c193d]"
                                : "bg-[#98f5e1]  text-[#236c5b"
                            }]`}
                        >
                            <p className="font-sans">{message}</p>
                            <button className="font-bold">&#10005;</button>
                        </div>
                        )}
                        <div className="py-4 px-8 text-black text-xl border-b border-grey-lighter">
                        Register
                        </div>
                        <form
                        className="py-4 px-8"
                        onSubmit={handleSubmit(handleFormSubmit)}
                        >
                        <div className="flex mb-4">
                            <div className="w-full mr-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                id="nom"
                                type="text"
                                placeholder="Full name"
                                {...register("nom")}
                            />
                            {errors.nom ? (
                                <p className="text-red-500 text-xs mt-1">
                                {errors.nom?.message}
                                </p>
                            ) : null}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2">
                            Email Address
                            </label>
                            <input
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                            id="email"
                            type="email"
                            placeholder="Your email address"
                            {...register("email")}
                            />
                            {errors.email ? (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email?.message}
                            </p>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2">
                            Password
                            </label>
                            <input
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                            id="pass"
                            type="password"
                            placeholder="Your secure password"
                            {...register("pass")}
                            />
                            <p className="text-grey text-xs mt-1">At least 6 characters</p>
                            {errors.pass ? (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.pass?.message}
                            </p>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2">
                            Confirm Password
                            </label>
                            <input
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                            id="confirmPass"
                            type="password"
                            placeholder="Your secure password"
                            {...register("confirmPass")}
                            />
                            {errors.confirmPass ? (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPass?.message}
                            </p>
                            ) : null}
                        </div>
                        <div className="flex items-center justify-between mt-8">
                            <button
                            className="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => console.log("eer")}
                            >
                            Sign Up
                            </button>
                        </div>
                        </form>
                    </div>
                    <p className="text-center my-4">
                        <Link
                        href="/auth/api/login"
                        className="text-grey-dark text-sm no-underline hover:text-grey-darker"
                        >
                        I already have an account
                        </Link>
                    </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export  {RegisterForm}