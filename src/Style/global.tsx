import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
    #root {
        height: 100%;
    }

    .container {
        height: 100vh;
        width: 100%;
        background-image: url('./img/bg.jpg') ;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .loginForm{
        background-color: rgba(255, 255, 255, 0.9);
        padding: 1rem;
        border-radius: 15px;
    }

    .marginTopBottom{
        margin: 1rem 0;
    }

    .uploadButton {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(23, 18, 112, 0.4);
        padding: 2em;
        height: 80px;
        width: 120px;
        margin: 1em 0;
        overflow: hidden;

        input {
        display: none;
        }
        &:hover{
        cursor: pointer;
        }
    }
`
