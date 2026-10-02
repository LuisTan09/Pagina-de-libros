# CondeGátula · Librería online con panel de administrador

Archivos (todos en la raíz del repositorio, sin carpetas):
index.html · styles.css · app.js · cats.js · admin.js · content.js · firebase-config.js · portada.png

## Entrar como administrador
Pie de página → "Administrador" (o agrega #admin a la dirección).
Correo permitido: aux.reg.academicoii@autonoma.edu.co (se cambia en firebase-config.js).

## Dos formas de publicar los cambios
**A) Modo local (funciona ya, sin configurar nada).** Crea una contraseña la primera vez.
Tus cambios se guardan en tu navegador. Para que los vea todo el mundo: pestaña Publicar →
"Descargar content.json" → súbelo a la raíz del repositorio en GitHub.

**B) Modo Firebase (recomendado: publica al instante y la contraseña es real).**
1. console.firebase.google.com → crea un proyecto → agrega una app Web y copia su config en firebase-config.js.
2. Authentication → Sign-in method → activa "Correo/contraseña" → Users → Add user con el correo del administrador.
3. Firestore Database → crea la base y en Reglas pega:

    rules_version = '2';
    service cloud.firestore {
      match /databases/{db}/documents {
        match /site/content {
          allow read: if true;
          allow write: if request.auth != null && request.auth.token.email == 'aux.reg.academicoii@autonoma.edu.co';
        }
      }
    }

4. Authentication → Settings → Authorized domains → agrega luistan09.github.io.
