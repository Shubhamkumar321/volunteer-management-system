package com.volunteer.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String uploadEventImage(
            MultipartFile file
    );

}