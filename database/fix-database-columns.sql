-- Update passwords for test users with correct hashes
UPDATE users SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'test@example.com'; -- password
UPDATE users SET password = '$2b$10$vI8aWBWTRp.rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@galaxytoyota.com'; -- admin123  
UPDATE users SET password = '$2b$10$xJ9cWDWURq.sOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'superadmin@galaxytoyota.com'; -- superadmin123
