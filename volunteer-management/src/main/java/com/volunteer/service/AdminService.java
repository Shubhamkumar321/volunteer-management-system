package com.volunteer.service;

import com.volunteer.dto.DashboardStatisticsResponse;
import com.volunteer.dto.AdminReportsResponse;

public interface AdminService {

    DashboardStatisticsResponse getDashboard();

    AdminReportsResponse getReports();
}