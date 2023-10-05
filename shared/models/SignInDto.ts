export interface SignInDtoReq {
    username: string,
    password: string,
}
export interface SignInDtoRes {
    access_token: string
}