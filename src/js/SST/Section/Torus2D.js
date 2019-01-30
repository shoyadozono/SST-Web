'use strict';

import { RES_X, RES_Y, NUM_PARTICLES, TORUS_RADIUS, SCALE } from '../Constants.js';
import { SectionBase } from './SectionBase.js';

export class Torus2D extends SectionBase {

    constructor( type = 0 )
    {
        super();

        this.type = type;

        this.radiuses = [ ...Array(3).keys() ].map( (r, i) => {
            return TORUS_RADIUS * Math.pow( 0.5, i + 1 );
        });

        this.z0 = -this.radiuses[ 2 ];
        this.x0 = -this.radiuses[ 1 ] - this.radiuses[ 2 ];

        this.geometry = new THREE.Geometry();
        for ( let i = 0; i < NUM_PARTICLES * 2; i++ )
        {
            this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        }

        this.material = new THREE.PointsMaterial({
            size: 1.5,
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
    
        this.mesh = new THREE.Points( this.geometry, this.material );
    }

    crossSectionY()
    {
        const rangeT1 =  0;
        const rangeT2 =  Math.PI * 2;
        const rangeS1 = -Math.PI / 2;
        const rangeS2 =  Math.PI / 2;

        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j=0; j < RES_Y; j++ )
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const x = ( R1 + Math.sqrt( R2 * R2 - this.z0 * this.z0) * sign ) * Math.cos( t ) * SCALE;
                    const y = ( R1 + Math.sqrt( R2 * R2 - this.z0 * this.z0) * sign ) * Math.sin( t ) * SCALE;
                    const z = this.z0 * SCALE;

                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1 );
        compute( -1 );

        this.geometry.verticesNeedUpdate = true;
    }
    
    crossSectionXZ()
    {
        const rangeT1 =  0;
        const rangeT2 =  Math.PI * 2;
        const rangeS1 = -Math.PI / 2;
        const rangeS2 =  Math.PI / 2;

        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        let counter = 0;

        const compute = ( sign ) => 
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2-rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2-rangeS1);
                    
                    const x = this.x0 * SCALE;
                    const y = this.x0 * Math.tan( t ) * SCALE;
                    const tmp = Math.pow(R2, 2) - Math.pow(this.x0 / Math.cos( t ) - R1, 2);
                    const z = Math.sqrt( tmp ) * SCALE * sign;
                    
                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1 );
        compute( -1 );

        this.geometry.verticesNeedUpdate = true;
    }

    animate()
    {
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        this.z0 += 0.005;
        if ( this.z0 > R2 ) this.z0 = -R2;

        this.x0 += 0.005;
        if ( this.x0 > R1 + R2 ) this.x0 = -R1 - R2;
    }

    update()
    {
        if ( this.isVisible() )
        {
            if ( this.type === 0 ) this.crossSectionY();
            if ( this.type === 1 ) this.crossSectionXZ();
            this.animate();
        }
    }

}