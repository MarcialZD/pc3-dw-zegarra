import Servicios from './servicios.js';

class GestorUsuarios {
    constructor() {
        this.servicios = new Servicios();
        this.token = '';
        this.usuarios = [];
        this.init();
    }

    login() {
        const usuario = $('#user').val();
        const contrasena = $('#pass').val();

        this.servicios.autenticar(usuario, contrasena, (error, response) => {
            if (error) {
                alert('Usuario o contraseña incorrectos');
            } else {
                if (response.status == 200) {
                    alert('¡Login exitoso!');
                    this.token = response.token;
                    this.cleanMain();
                    this.mostrarUsuarios(this.token);
                }
            }
        });
    }

    mostrarUsuarios(token) {
        this.servicios.obtenerUsuarios(token, (error, response) => {
            if (error) {
                console.error('Error al obtener usuarios:', error);
            } else {
                this.renderizarUsuarios(response);
            }
        });
    }

    cleanMain() {
        $("#mainlogin").html("");
    }

    renderizarUsuarios(usuarios) {
        usuarios.forEach(entrenador => {
            let pokemonsHTML = '';

            entrenador.pokemons.forEach(pokemon => {
                const color = this.getColorPorTipo(pokemon.tipo);
                pokemonsHTML += `
                    <td style="border: solid 1px ${color}; border-radius: 10%; padding: 10px; margin-right: 10px;">
                        <p>Nombre: ${pokemon.nombre}</p>
                        <p style="color:${color};">Tipo: ${pokemon.tipo}</p>
                        <img src="${pokemon.foto}" alt="${pokemon.nombre}" width="50">
                    </td>
                `;
            });

            for (let i = entrenador.pokemons.length; i < 5; i++) {
                pokemonsHTML += '<td style="padding: 10px;"></td>';
            }

            $('#mainlogin').append(`
                <div style="display: flex; margin: 20px; padding-left: 10px; border: solid 1px black; width: 15%; border-radius: 10%; height: 100px;">
                    <h3 style="margin-right: 20px;">${entrenador.entrenador}</h3>
                    <img src="${entrenador.foto}" alt="" width="50" style="border-radius: 10%;">
                </div>
                <table style="margin-top: 10px;">
                    <tr>
                        <th>Pokemon 1</th>
                        <th>Pokemon 2</th>
                        <th>Pokemon 3</th>
                        <th>Pokemon 4</th>
                        <th>Pokemon 5</th>
                    </tr>
                    <tr>
                        ${pokemonsHTML}
                    </tr>
                </table>
            `);
        });

        const entrenador1 = usuarios[Math.floor(Math.random() * usuarios.length)];
        let entrenador2;
        do {
            entrenador2 = usuarios[Math.floor(Math.random() * usuarios.length)];
        } while (entrenador2 === entrenador1);

        const pokemon1 = entrenador1.pokemons[Math.floor(Math.random() * entrenador1.pokemons.length)];
        const pokemon2 = entrenador2.pokemons[Math.floor(Math.random() * entrenador2.pokemons.length)];

        let ganador;
        if (this.esTipoFuerteContra(pokemon1.tipo, pokemon2.tipo)) {
            ganador = entrenador1.entrenador;
        } else if (this.esTipoFuerteContra(pokemon2.tipo, pokemon1.tipo)) {
            ganador = entrenador2.entrenador;
        } else {
            ganador = 'Empate';
        }

        $('#mainlogin').append(` <h1>Batalla Pokemon!!</h1>
        <div style="text-align: center;">
        <table width="50%" style="margin: 0 auto;">
            <tr>
                <th>Entrenador</th>
                <th>Entrenador Foto</th>
                <th>Pokemon</th>
                <th>Foto</th>
            </tr>
            <tr>
                <td>${entrenador1.entrenador}</td>
                <td><img src="${entrenador1.foto}" alt="${entrenador1.entrenador}" width="50"></td>

                <td>${pokemon1.nombre} </td>
                <td><img src="${pokemon1.foto}" alt="${pokemon1.nombre}" width="50"></td>
            </tr>
            <tr>
            <td>${entrenador2.entrenador}</td>
            <td><img src="${entrenador2.foto}" alt="${entrenador2.entrenador}" width="50"></td>

            <td>${pokemon2.nombre} </td>
            <td><img src="${pokemon2.foto}" alt="${pokemon2.nombre}" width="50"></td>
            </tr>
            <tr>
                <td colspan="3">Ganador: ${ganador}</td>
            </tr>
        </table>
    </div>
 `);

    }

    esTipoFuerteContra(tipoAtacante, tipoDefensor) {
        // Reglas de tipo Pokémon (ejemplo simple)
        if ((tipoAtacante === 'fuego' && tipoDefensor === 'planta') ||
            (tipoAtacante === 'agua' && tipoDefensor === 'fuego') ||
            (tipoAtacante === 'planta' && tipoDefensor === 'agua')) {
            return true;
        }
        return false;
    }

    getColorPorTipo(tipo) {
        switch (tipo) {
            case 'fuego':
                return 'red';
            case 'agua':
                return 'blue';
            case 'planta':
                return 'green';
            case 'roca':
                return 'brown';
            case 'volador':
                return 'skyblue';
            case 'electrico':
                return 'yellow';
            case 'psiquico':
                return 'brown';
            default:
                return 'black';
        }
    }

    renderLogin() {
        const templatelogin = `<div class="inputLogin">
            <div class="input">
                <label>Usuario</label>
                <input type="text" id="user" />
            </div>
            <div class="input">
                <label>Password</label>
                <input type="password" id="pass" />
            </div>
            <div class="input">
                <button type="submit" class="btn" id="btLogin">Logear</button>
            </div>
        </div>`;
        $("#mainlogin").append(templatelogin);
    }

    render() {
        this.renderLogin();
    }

    init() {
        this.render();
        $('#btLogin').on('click', () => {
            this.login();
        });
    }
}

export default GestorUsuarios;
