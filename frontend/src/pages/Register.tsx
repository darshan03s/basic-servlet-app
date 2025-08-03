import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, LogIn, Loader2 } from "lucide-react";
import type { Student } from "@/types";

type RegisterFormData = Omit<Student, 'id'>;

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<RegisterFormData>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: 0,
            reg_no: '',
            marks1: 0,
            marks2: 0,
            marks3: 0
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

    // Watch all fields to enable/disable submit button
    const watchedFields = watch();
    const allFieldsFilled = Object.values(watchedFields).every(value => 
        typeof value === 'string' ? value.trim() !== '' : value > 0
    );

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'Registration successful!');
                navigate('/login');
            } else {
                toast.error(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <UserPlus className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground">Fill in your details to register</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            {...register('name', { 
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: { 
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                    message: 'Invalid email address' 
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
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

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register('phone', { 
                                required: 'Phone number is required',
                                valueAsNumber: true,
                                validate: value => value > 1000000000 || 'Enter a valid 10-digit phone number'
                            })}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

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

                    {/* Marks */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="marks1">Marks 1</Label>
                            <Input
                                id="marks1"
                                type="number"
                                placeholder="0-100"
                                {...register('marks1', { 
                                    required: 'Marks 1 is required',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Marks cannot be negative' },
                                    max: { value: 100, message: 'Marks cannot exceed 100' }
                                })}
                            />
                            {errors.marks1 && (
                                <p className="text-xs text-destructive">{errors.marks1.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="marks2">Marks 2</Label>
                            <Input
                                id="marks2"
                                type="number"
                                placeholder="0-100"
                                {...register('marks2', { 
                                    required: 'Marks 2 is required',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Marks cannot be negative' },
                                    max: { value: 100, message: 'Marks cannot exceed 100' }
                                })}
                            />
                            {errors.marks2 && (
                                <p className="text-xs text-destructive">{errors.marks2.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="marks3">Marks 3</Label>
                            <Input
                                id="marks3"
                                type="number"
                                placeholder="0-100"
                                {...register('marks3', { 
                                    required: 'Marks 3 is required',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Marks cannot be negative' },
                                    max: { value: 100, message: 'Marks cannot exceed 100' }
                                })}
                            />
                            {errors.marks3 && (
                                <p className="text-xs text-destructive">{errors.marks3.message}</p>
                            )}
                        </div>
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
                                Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Register
                            </>
                        )}
                    </Button>
                </form>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Already registered?{' '}
                        <Link 
                            to="/login" 
                            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                            <LogIn size={14} />
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;