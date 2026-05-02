FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY TaskManagement.Domain/TaskManagement.Domain.csproj TaskManagement.Domain/
COPY TaskManagement.Application/TaskManagement.Application.csproj TaskManagement.Application/
COPY TaskManagement.Infrastructure/TaskManagement.Infrastructure.csproj TaskManagement.Infrastructure/
COPY TaskManagement.WebAPI/TaskManagement.WebAPI.csproj TaskManagement.WebAPI/

RUN dotnet restore TaskManagement.WebAPI/TaskManagement.WebAPI.csproj

COPY . .
RUN dotnet publish TaskManagement.WebAPI/TaskManagement.WebAPI.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TaskManagement.WebAPI.dll"]