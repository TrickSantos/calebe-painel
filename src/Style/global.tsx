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
`
