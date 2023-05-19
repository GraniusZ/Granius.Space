import {FC, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {LoginFormType} from "types/LoginFormType.ts";
import {ReactComponent as ArrowIcon} from "@assets/icons/ArrowIcon.svg";
import {ReactComponent as CheckIcon} from "@assets/icons/CheckIcon.svg";
import {Link} from "react-router-dom";
import {Spinner} from "@/ui/Spinner.tsx";
import {useSignIn} from "@modules/LoginForm/hooks/useSignIn.ts"

export const LoginForm: FC = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormType>({
        mode: "onChange",
    });
    const [signIn, firebaseError, loading] = useSignIn();
    const handleLogin: SubmitHandler<LoginFormType> = (data) => {
        return signIn({rememberMe, ...data});
    }
    const handleRememberMe = (): void => {
        setRememberMe(!rememberMe);
    };
    return (
        <div className="w-full h-full flex justify-center items-center font-mono mx-6">
            <form
                className="m-auto max-w-2xl w-full flex items-center justify-center flex-col bg-1 rounded-xl px-8 py-5"
                onSubmit={handleSubmit(handleLogin)}>
                <label className="text-4 text-5xl mb-6">Sign in</label>
                <div className="w-full mb-4 gap-3 flex-col">
                    <input
                        style={{border: errors.email && "1px solid red"}}
                        className="bg-2 w-full text-4  text-2xl px-5 py-3 rounded-lg placeholder:text-4 box-border"
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
                        <span className="text-3 text-xl">{errors.email.message}</span>
                    )}
                </div>
                <div className="w-full mb-5 gap-3 flex-col">
                    <input
                        style={{border: errors.password && "1px solid red"}}
                        className="bg-2 w-full text-4  text-2xl px-5 py-3 rounded-lg placeholder:text-4 box-border"
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
                        <span className="text-3 text-xl">{errors.password.message}</span>
                    )}
                </div>
                <div className="w-full flex flex-nowrap justify-between gap-8 text-lg text-3 mb-5">
                    <div className="flex gap-2 items-center relative bg-transparent select-none ">
                        <div
                            onClick={handleRememberMe}
                            className={`w-5 h-5 cursor-pointer transition duration-200 ease-in-out ${rememberMe ? "bg-3" : "bg-4"}`}
                        >
                            {rememberMe && (
                                <CheckIcon className="w-5 h-5 fill-1"
                                />
                            )}
                        </div>
                        <span>
                Remember me
              </span>
                    </div>
                    <Link to={"/"}>
                        Forget Password
                    </Link>
                </div>
                <div className="w-full mb-6 ">
                    {firebaseError && (
                        <div className="text-3 text-xl">{firebaseError}</div>
                    )}
                    <button type={"submit"} className="w-full flex py-4 rounded-lg bg-2 max-h-14 justify-center items-center">
                        <div className="w-full h-full">
                            {!loading ? (
                                <div className="w-full h-full justify-center items-center gap-3 flex text-4 text-base">
                                    <span>Sign in</span>
                                    <ArrowIcon/>
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
            <span className="text-3">
              Don’t have account?
              <Link to={"../register"} className="text-4">
                &nbsp;Sign Up
              </Link>
            </span>
                </div>
            </form>
        </div>
    );
};