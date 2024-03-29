import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";

import {ReactComponent as ArrowIcon} from "@assets/icons/ArrowIcon.svg";
import {useSignUp} from "../hooks/useSignUp.ts";
import {Spinner} from "@/ui/Spinner";
import {RegisterFormType} from "types/RegisterFormType.ts";

export const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterFormType>({
        mode: "onChange",
    });
    const [handleRegister, firebaseError, loading] = useSignUp();
    return (
        <>
            <div className="w-full h-full flex justify-center items-center font-mono mx-2 md:mx-6 ">
                <form
                    className="m-auto max-w-xl w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-8 py-5"
                    onSubmit={handleSubmit(handleRegister)}
                    data-testid={"registerForm"}

                >
                    <label className="text-main-4 md:text-2xl mb-3 sm:mb-6 text-xl">Sign up</label>
                    <div className="w-full mb-4 gap-3 flex-col">
                        <input
                            autoComplete="off"
                            className={`mb-1 bg-main-2 w-full text-main-4 text-sm md:text-base px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.firstName ? 'border-red-500' : ''} `}
                            type={"text"}
                            placeholder={"Name"}
                            {...register("firstName", {
                                required: {
                                    value: true,
                                    message: "Please enter your name",
                                },
                                pattern: {
                                    value: /^[a-zA-Z]*$/,
                                    message: "The name must be in English",
                                },
                            })}
                        />
                        {errors.firstName && (
                            <span className="text-main-6 text-xs md:text-sm">{errors.firstName.message}</span>
                        )}
                    </div>

                    <div className="w-full mb-4 gap-3 flex-col">
                        <input
                            autoComplete="off"
                            className={`mb-1 bg-main-2 w-full text-main-4 text-sm md:text-base px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.secondName ? 'border-red-500' : ''} `}
                            placeholder={"Surname"}
                            type={"text"}
                            {...register("secondName", {
                                required: {
                                    value: true,
                                    message: "Please enter your surname",
                                },
                                pattern: {
                                    value: /^[a-zA-Z]*$/,
                                    message: "The surname must be in English",
                                },
                            })}
                        />
                        {errors.secondName && (
                            <span className="text-main-6 text-xs md:text-sm">{errors.secondName.message}</span>
                        )}
                    </div>

                    <div className="w-full mb-4 gap-3 flex-col">
                        <input
                            autoComplete="new-email"
                            className={`mb-1 bg-main-2 w-full text-main-4 text-sm md:text-base px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.email ? 'border-red-500' : ''} `}
                            placeholder={"Email"}
                            type={"email"}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Please enter your email address",
                                },
                                pattern: {
                                    value:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <span className="text-main-6 text-xs md:text-sm">{errors.email.message}</span>
                        )}
                    </div>
                    <div className="w-full mb-7 sm:mb-8 gap-3 flex-col">
                        <input
                            autoComplete="new-password"
                            className={`mb-1 bg-main-2 w-full text-main-4 text-sm md:text-base px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.password ? 'border-red-500' : ''} `}
                            type={"password"}
                            placeholder={"Password"}
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Please enter your password",
                                },
                            })}
                        />
                        {errors.password && (
                            <span className="text-main-6 text-xs md:text-sm">{errors.password.message}</span>
                        )}
                    </div>
                    <div className="w-full mb-3 sm:mb-6 relative flex justify-center ">
                        {firebaseError && (
                            <div className="text-main-6 text-xs md:text-sm absolute top-[-20px] left-0">{firebaseError}</div>
                        )}
                        <button type={"submit"}
                                className="w-full flex py-4 rounded-lg bg-main-2 max-h-12 justify-center items-center">
                            <div className="w-full h-full">
                                {!loading ? (
                                    <div
                                        className="w-full h-full justify-center items-center gap-3 flex text-main-4 text-lg md:text-xl px-1 ">
                                        <span>Sign Up</span>
                                        <ArrowIcon className="fill-main-4"/>
                                    </div>
                                ) : (
                                    <div className="w-full h-full justify-center items-center flex">
                                        <Spinner/>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                    <div>
            <span className="text-main-6 text-sm md:text-base">
              Have account?
              <Link to={"../login"} className="text-main-4">
                &nbsp;Sign In
              </Link>
            </span>
                    </div>
                </form>
            </div>
        </>
    );
};
