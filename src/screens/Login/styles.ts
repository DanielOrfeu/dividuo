import styled from "styled-components/native";

export const Container = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    padding: 15px;
    background-color: #00AB8C;
`
export const PageTitle = styled.Text`
    color: white;
    font-size: 44px;
`
export const Input = styled.TextInput`
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: 20px;
    margin: 5px 0px;
    &:focus-within{
        border-color: red;
    }
`