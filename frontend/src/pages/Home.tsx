import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, FileText } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
    const navigate = useNavigate();

    const handleSeeResults = () => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/see-results');
        } else {
            toast.error('Please login to see results');
            navigate('/login');
        }
    };

    return (
        <div 
            className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
            style={{ backgroundImage: 'url(/college.jpg)' }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center space-y-8 px-4">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        Welcome to KodNest
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        Your gateway to academic excellence and results
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/register')}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-40"
                    >
                        <UserPlus size={20} />
                        Register
                    </Button>

                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 min-w-40"
                    >
                        <LogIn size={20} />
                        Login
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleSeeResults}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 min-w-40"
                    >
                        <FileText size={20} />
                        See Results
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;