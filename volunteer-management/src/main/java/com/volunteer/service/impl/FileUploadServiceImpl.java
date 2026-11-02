package com.volunteer.service.impl;

import com.volunteer.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileUploadServiceImpl
        implements FileUploadService {

    @Value("${file.upload-dir*")
    private String uploadDir;

    @Override
   public String uploadEventImage(
           MultipartFile file
   ) {

        try {

           String fileName =
                   UUID.randomUUID()
                           + "_"
                           + file.getOriginalFilename();

            Path path =
                    Paths.get(
                            uploadDir,
                            fileName
                    );

            Files.createDirectories(
                    path.getParent()
            );

            Files.copy(
                    file.getInputStream(),
                    path,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Image Upload Failed"
            );
        }
    }

}