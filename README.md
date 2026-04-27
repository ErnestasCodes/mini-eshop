# Mini E-Shop

Pilno stacko mini e-shop projektas su atskiru backend ir frontend. Projektą kūriau tam, kad praktiškai išbandyčiau .NET Web API, darbą su duomenų baze ir frontend–backend integraciją.
Frontend pilnai parašytas naudojantis AI įrankiais, nes visas fokusas skirtas backend mokymuisi

Live demo: https://mini-eshop-black.vercel.app/

# Pastabos
Projektas nėra baigtinis – jį nuolat pildau, pridedu naujų funkcijų ir taisau klaidas.

Test users:

Admin:
Email: admin@example.com
Password: Admin123!

User:
Email: user@example.com
Password: User123!

## Naudotos technologijos

**Backend:**
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

**Frontend:**
- React
- Vite
- Tailwind CSS

## Funkcionalumas

- Vartotojo registracija ir prisijungimas
- Produktų sąrašo atvaizdavimas
- Produkto detalės puslapis
- Prekių pridėjimas į krepšelį
- Paprasta admin dalis
- Komunikacija su backend per REST API

## Projekto struktūra

- `backend/` – API, verslo logika ir darbas su duomenų baze  
- `frontend/` – vartotojo sąsaja ir API užklausos

## Paleidimas

Backend:

```bash
cd backend
dotnet run


