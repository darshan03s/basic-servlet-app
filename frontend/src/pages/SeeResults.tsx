import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Search, Loader2, Trophy } from "lucide-react";
import type { Student } from "@/types";

type SearchFormData = {
    reg_no: string;
};

const SeeResults = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [studentResults, setStudentResults] = useState<Student | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<SearchFormData>({
        mode: 'onChange',
        defaultValues: {
            reg_no: ''
        }
    });

    // Check if user is logged in (protected route)
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            toast.error('Please login to access this page');
            navigate('/login');
        }
    }, [navigate]);

    // Watch field to enable/disable submit button
    const regNo = watch('reg_no');
    const isFieldFilled = regNo.trim() !== '';

    const onSubmit = async (data: SearchFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/see-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result && result.id) {
                // If we get a Student object
                setStudentResults(result);
                toast.success('Results found successfully!');
            } else {
                // If no valid Student object found
                setStudentResults(null);
                toast.error('No results found for this registration number');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('See results error:', error);
            setStudentResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotal = (marks1: number, marks2: number, marks3: number): number => {
        return marks1 + marks2 + marks3;
    };

    const calculatePercentage = (total: number): number => {
        return Math.round((total / 300) * 100);
    };

    const getGrade = (percentage: number): string => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">See Results</h1>
                    <p className="text-muted-foreground">Enter registration number to view marks</p>
                </div>

                {/* Search Form */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reg_no">Registration Number</Label>
                            <Input
                                id="reg_no"
                                placeholder="Enter registration number to search"
                                {...register('reg_no', { 
                                    required: 'Registration number is required',
                                    minLength: { value: 3, message: 'Registration number must be at least 3 characters' }
                                })}
                            />
                            {errors.reg_no && (
                                <p className="text-sm text-destructive">{errors.reg_no.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!isValid || !isFieldFilled || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Search Results
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Results Display */}
                {studentResults && (
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-6">
                        {/* Student Info */}
                        <div className="text-center space-y-2">
                            <div className="flex justify-center">
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold">{studentResults.name}</h2>
                            <p className="text-muted-foreground">Registration: {studentResults.reg_no}</p>
                        </div>

                        {/* Marks Table */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-center">Academic Results</h3>
                            
                            <div className="grid gap-4">
                                {/* Individual Marks */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-primary">{studentResults.marks1}</div>
                                        <div className="text-sm text-muted-foreground">Subject 1</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-primary">{studentResults.marks2}</div>
                                        <div className="text-sm text-muted-foreground">Subject 2</div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-primary">{studentResults.marks3}</div>
                                        <div className="text-sm text-muted-foreground">Subject 3</div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="border-t border-border pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-primary/10 rounded-lg p-4 text-center">
                                            <div className="text-xl font-bold text-primary">
                                                {calculateTotal(studentResults.marks1, studentResults.marks2, studentResults.marks3)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total Marks</div>
                                            <div className="text-xs text-muted-foreground">(out of 300)</div>
                                        </div>
                                        <div className="bg-accent/10 rounded-lg p-4 text-center">
                                            <div className="text-xl font-bold text-accent-foreground">
                                                {calculatePercentage(calculateTotal(studentResults.marks1, studentResults.marks2, studentResults.marks3))}%
                                            </div>
                                            <div className="text-sm text-muted-foreground">Percentage</div>
                                        </div>
                                        <div className="bg-secondary/10 rounded-lg p-4 text-center">
                                            <div className="text-xl font-bold text-secondary-foreground">
                                                {getGrade(calculatePercentage(calculateTotal(studentResults.marks1, studentResults.marks2, studentResults.marks3)))}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Grade</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeeResults;