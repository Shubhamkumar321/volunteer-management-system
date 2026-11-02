package com.volunteer.controller;

import com.volunteer.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService
            fileUploadService;

    @PostMapping("/event-image")
    public String uploadImage(

            @RequestParam("file")
            MultipartFile file
    ) {

        return fileUploadService
                .uploadEventImage(file);
    }
}