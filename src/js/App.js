'use strict';

// const THREE = require( 'three' );

import * as SST from './SST/SST.js'

const DEBUG_MODE = false;

class App
{
    constructor()
    {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer( {
            canvas: document.querySelector( '#myCanvas' )
        });
        this.renderer.setSize( w, h );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 45, w / h );
        this.camera.position.set( 0, 0, 1000 );
        this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

        this.controls = new THREE.OrbitControls( this.camera );

        if ( DEBUG_MODE )
        {
            this.axis = new THREE.AxesHelper( 1000 );
            this.scene.add( this.axis );
        }

        this.initTorus();
        this.initGui();
        this.setTorus( 0 ); 
        this.update();

        window.addEventListener( 'resize', this.resize.bind( this ) );

        document.addEventListener( 'touchmove', function( e ) { e.preventDefault(); }, { passive: false } );
    }

    initGui()
    {
        $( '.ui.dropdown' )
            .dropdown({
                values: [
                {
                    name: '2D TORUS (3D-space) - Y-section',
                    value: '0',
                    selected: true
                },
                {
                    name: '2D TORUS (3D-space) - XZ-section',
                    value: '1'
                },
                {
                    name: '3D TORUS (4D-space) - A1A2-section(SphereBaseTorus)',
                    value: '2'
                },
                {
                    name: '3D TORUS (4D-space) - A3A4-section(SphereBaseTorus)',
                    value: '3'
                },
                {
                    name: '3D TORUS (4D-space) - B1-section(CircleBaseTorus)',
                    value: '4'
                },
                {
                    name: '3D TORUS (4D-space) - B2-section(CircleBaseTorus)',
                    value: '5'
                },
                {
                    name: '3D TORUS (4D-space) - B3-section(CircleBaseTorus)',
                    value: '6'
                },
                {
                    name: '4D TORUS (5D-space) - B1-section(CircleBaseTorus)',
                    value: '7'
                },
                {
                    name: '4D TORUS (5D-space) - B2-section(CircleBaseTorus)',
                    value: '8'
                },
                {
                    name: '6D TORUS (7D-space) - B1-section(CircleBaseTorus)',
                    value: '9'
                },
                {
                    name: '6D TORUS (7D-space) - B2-section(CircleBaseTorus)',
                    value: '10'
                }
            ],
            onChange: function( value, text, $selectedItem )
            {
                this.setTorus( Number( value ) );
                this.controls.reset();
            }.bind( this )
        });
    }

    initTorus()
    {
        this.torus2D = new SST.Torus2D();
        this.scene.add( this.torus2D.getMesh() );
    
        this.torus3D = new SST.Torus3D();
        this.scene.add( this.torus3D.getMesh() );
    
        this.torus4D = new SST.Torus4D();
        this.scene.add( this.torus4D.getMesh() );
    
        this.torus6D = new SST.Torus6D();
        this.scene.add( this.torus6D.getMesh() );
    }

    setTorus( which )
    {
        this.hideAllTorus();

        if ( which === 0 )
        {
            this.torus2D.show();
            this.torus2D.setType( 0 );
        }
        
        else if ( which === 1 )
        {
            this.torus2D.show();
            this.torus2D.setType( 1 );
        }

        else if ( which === 2 )
        {
            this.torus3D.show();
            this.torus3D.setType( 0 );
        }

        else if ( which === 3 )
        {
            this.torus3D.show();
            this.torus3D.setType( 1 );
        }

        else if ( which === 4 )
        {
            this.torus3D.show();
            this.torus3D.setType( 2 );
        }

        else if ( which === 5 )
        {
            this.torus3D.show();
            this.torus3D.setType( 3 );
        }

        else if ( which === 6 )
        {
            this.torus3D.show();
            this.torus3D.setType( 4 );
        }

        else if ( which === 7 )
        {
            this.torus4D.show();
            this.torus4D.setType( 0 );
        }

        else if ( which === 8 )
        {
            this.torus4D.show();
            this.torus4D.setType( 1 );
        }

        else if ( which === 9 )
        {
            this.torus6D.show();
            this.torus6D.setType( 0 );
        }

        else if ( which === 10 )
        {
            this.torus6D.show();
            this.torus6D.setType( 1 );
        }
    }

    hideAllTorus()
    {
        this.torus2D.hide();
        this.torus3D.hide();
        this.torus4D.hide();
        this.torus6D.hide();
    }

    update()
    {
        this.torus2D.update();
        this.torus3D.update();
        this.torus4D.update();
        this.torus6D.update();
        
        this.renderer.render( this.scene, this.camera );

        requestAnimationFrame( this.update.bind( this ) );
    }

    resize()
    {
        const w = window.innerWidth;
        const h = window.innerHeight;
      
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( w, h );
      
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }
}

window.addEventListener( 'load', new App() );
