package com.volunteer.exception;

import com.volunteer.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            BadRequestException.class
    )
    @ResponseStatus(
            HttpStatus.BAD_REQUEST
    )
    public ErrorResponse handleBadRequest(
            BadRequestException ex
    ) {

        return ErrorResponse.builder()

                .message(
                        ex.getMessage()
                )

                .status(
                        400
                )

                .timestamp(
                        LocalDateTime.now()
                )

                .build();
    }
}