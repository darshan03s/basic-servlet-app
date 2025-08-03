import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

type LoginFormData = {
    reg_no: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: {
            reg_no: '',
            password: ''
        }
    });

    // Check if user is already logged in
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            toast.info('Already logged in');
            navigate('/');
        }
    }, [navigate]);

    // Watch fields to enable/disable submit button
    const watchedFields = watch();
    const allFieldsFilled = Object.values(watchedFields).every(value => 
        value.trim() !== ''
    );

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success !== false && result.id) {
                // If we get a Student object (success case)
                localStorage.setItem('user', JSON.stringify(result));
                toast.success('Login successful!');
                navigate('/see-results');
            } else {
                // If we get success: false or no valid Student object
                toast.error(result.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <LogIn className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Registration Number */}
                    <div className="space-y-2">
                        <Label htmlFor="reg_no">Registration Number</Label>
                        <Input
                            id="reg_no"
                            placeholder="Enter your registration number"
                            {...register('reg_no', { 
                                required: 'Registration number is required',
                                minLength: { value: 3, message: 'Registration number must be at least 3 characters' }
                            })}
                        />
                        {errors.reg_no && (
                            <p className="text-sm text-destructive">{errors.reg_no.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', { 
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!isValid || !allFieldsFilled || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </>
                        )}
                    </Button>
                </form>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                            <UserPlus size={14} />
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;