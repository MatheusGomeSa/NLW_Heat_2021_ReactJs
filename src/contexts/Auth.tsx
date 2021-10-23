import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signinUrl: string;
    signOut: () => void;
}

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null);
    const signinUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=49a2a529788bf9b23391`

    function signOut() {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('/authenticate', {
            code: githubCode,
            isMobile: false
        })
        const { token, user } = response.data;
        localStorage.setItem('@dowhile:token', token);
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        setUser(user);
    }

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=');
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutCode)
            signIn(githubCode);
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')
        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }

    }, [])

    return (
        <AuthContext.Provider value={{ user, signinUrl, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}