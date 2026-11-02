package com.volunteer.controller;

import com.volunteer.entity.Category;
import com.volunteer.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository
            categoryRepository;

    @PostMapping
    public Category createCategory(
            @RequestBody Category category
    ) {

        return categoryRepository.save(
                category
        );
    }
}