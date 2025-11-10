'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: signInError } = await signIn(formData);

    if (signInError) {
      toast.error('Sign in failed', {
        description: signInError,
      });
      setLoading(false);
      return;
    }

    if (data) {
      toast.success('Welcome back!', {
        description: 'Taking you to your tasks...',
      });
      router.push('/today');
      router.refresh();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="w-full border-gray-200 dark:border-gray-800 shadow-xl animate-scale-in">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Sign in to continue your deep work journey
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
          
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}


