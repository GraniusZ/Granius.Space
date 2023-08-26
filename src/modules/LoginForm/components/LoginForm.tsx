import {FC} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {LoginFormType} from "types/LoginFormType.ts";
import {ReactComponent as ArrowIcon} from "@assets/icons/ArrowIcon.svg";
import {Link} from "react-router-dom";
import {Spinner} from "@/ui/Spinner.tsx";
import {useSignIn} from "@modules/LoginForm/hooks/useSignIn.ts"

export const LoginForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormType>({
        mode: "onChange",
    });
    const [signIn, firebaseError, loading] = useSignIn();
    const handleLogin: SubmitHandler<LoginFormType> = (data) => {
        return signIn({...data});
    }

    return (
        <div className="w-full h-full flex justify-center items-center font-mono mx-2 md:mx-6">
            <form
                className="m-auto max-w-xl w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-8 py-5 "
                onSubmit={handleSubmit(handleLogin)}>
                <label className="text-main-4 md:text-2xl mb-3 sm:mb-6 text-xl">Sign in</label>
                <div className="w-full mb-4 gap-3 flex-col">
                    <input
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
                        className={`mb-1 bg-main-2 w-full text-main-4 text-sm md:text-base  px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.password ? 'border-red-500' : ''}`}
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
                <div className="w-full mb-3 sm:mb-6 relative flex justify-center">
                    {firebaseError && (
                        <div className="text-main-6 text-xs md:text-sm absolute top-[-20px] left-0">{firebaseError}</div>
                    )}
                    <button type={"submit"}
                            className="w-full flex py-4 rounded-lg bg-main-2 max-h-12 justify-center items-center">
                        <div className="w-full h-full">
                            {!loading ? (
                                <div
                                    className="w-full h-full justify-center items-center gap-3 flex text-main-4 t text-lg md:text-xl  py-1">
                                    <span>Sign in</span>
                                    <ArrowIcon className="fill-main-4"/>
                                </div>
                            ) : (
                                <div className="w-full h-full justify-center items-center flex">
                                    <Spinner/>
                                </div>)
                            }

                        </div>
                    </button>
                </div>
                <div>
            <span className="text-main-6 text-sm md:text-base">
              Don’t have account?
              <Link to={"../register"} className="text-main-4">
                &nbsp;Sign Up
              </Link>
            </span>
                </div>
            </form>
        </div>
    );
};