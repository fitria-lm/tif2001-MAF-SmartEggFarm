// Test suite dasar validasi autentikasi Smart Egg Farm
describe('Auth Validation Suite', () => {
  test('Validasi format email pengguna', () => {
    const email = 'admin@smarteggfarm.com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).toBe(true);
  });

  test('Validasi peran pengguna (Admin/Karyawan/Kasir)', () => {
    const validRoles = ['Admin', 'Karyawan Kandang', 'Kasir'];
    const userRole = 'Karyawan Kandang';
    expect(validRoles).toContain(userRole);
  });
});