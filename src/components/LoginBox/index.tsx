import { useContext, useEffect } from "react"
import { VscGithubInverted } from "react-icons/vsc"
import { AuthContext } from "../../contexts/Auth"
import { api } from "../../services/api"
import styles from './styles.module.scss'



export function LoginBox(){
    const { signinUrl } = useContext(AuthContext)
    return(
        <div className={styles.LoginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signinUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com Github
            </a>
        </div>
    )
}