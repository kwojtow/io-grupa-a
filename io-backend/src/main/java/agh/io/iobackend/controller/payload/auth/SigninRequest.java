package agh.io.iobackend.controller.payload.auth;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SigninRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

}
