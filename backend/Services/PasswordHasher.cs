using System.Security.Cryptography;
using System.Text;

namespace web_api.Services;

public static class PasswordHasher
{
    public static string Hash(string password)
    {
        const int iterations = 100_000;
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            32);

        return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string password, string storedHash)
    {
        var rawParts = storedHash.Split('.');
        if (rawParts.Length != 3)
        {
            return false;
        }

        if (!int.TryParse(rawParts[0], out var iterations))
        {
            return false;
        }

        try
        {
            var salt = Convert.FromBase64String(rawParts[1]);
            var expectedHash = Convert.FromBase64String(rawParts[2]);

            var computedHash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                expectedHash.Length);

            return CryptographicOperations.FixedTimeEquals(computedHash, expectedHash);
        }
        catch
        {
            return false;
        }
    }
}
