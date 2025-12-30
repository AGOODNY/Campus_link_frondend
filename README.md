```mermaid
classDiagram
    class User {
      String name
      login()
    }
    class AuthService {
      authenticate(user)
    }
    User --> AuthService
```
