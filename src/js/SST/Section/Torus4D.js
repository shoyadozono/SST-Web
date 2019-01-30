'use strict';

import { RES_X, RES_Y, NUM_PARTICLES, TORUS_RADIUS, SCALE } from '../Constants.js';
import { SectionBase } from './SectionBase.js';

export class Torus4D extends SectionBase {

    constructor( type = 0 )
    {
        super();

        this.type = type;

        this.radiuses = [ ...Array(4).keys() ].map( (r, i) => {
            return TORUS_RADIUS * Math.pow( 0.5, i + 1 );
        });

        this.geometry = new THREE.Geometry();
        for ( let i = 0; i < NUM_PARTICLES * 4; i++ )
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

        this.x4 = -this.radiuses[ 2 ] - this.radiuses[ 3 ];
        this.x5 = -this.radiuses[ 3 ];

    }

    crossSectionB1()
    {
        const rangeT1 = 0;
        const rangeT2 = Math.PI * 2;
        const rangeS1 = 0;
        const rangeS2 = Math.PI * 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];
        const R3 = this.radiuses[ 3 ];

        let counter = 0;

        const compute = ( sign1, sign2 ) =>
        {
            for ( let i=0; i < RES_X; i++ ) 
            {
                for ( let j=0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const tmp = R2 + Math.sqrt(R3 * R3 - this.x5 * this.x5) * sign1;
                    const L = Math.sqrt(tmp * tmp - this.x4 * this.x4) * sign2;
                    
                    const x = (R0 + (R1 + L) * Math.cos( t )) * Math.cos( s ) * SCALE;
                    const y = (R0 + (R1 + L) * Math.cos( t )) * Math.sin( s ) * SCALE;
                    const z = (R1 + L) * Math.sin( t ) * SCALE;
                    
                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1, +1 );
        compute( -1, +1 );
        compute( +1, -1 );
        compute( -1, -1 );

        this.geometry.verticesNeedUpdate = true;
    }

    crossSectionB2()
    {
        const rangeT1 = 0;
        const rangeT2 = Math.PI * 2;
        const rangeS1 = 0;
        const rangeS2 = Math.PI * 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];
        const R3 = this.radiuses[ 3 ];

        let counter = 0;

        const compute = ( sign1, sign2 ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j=0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const tmp = R1 + Math.sqrt( Math.pow(R2 + R3 * Math.cos( t ), 2) - Math.pow( this.x4, 2 ) ) * sign2;
                    const L = Math.sqrt( tmp * tmp - this.x5 * this.x5 ) * sign1;
                    
                    const x = (R0 + L) * Math.sin( s ) * SCALE;
                    const y = (R0 + L) * Math.cos( s ) * SCALE;
                    const z = R3 * Math.sin( t ) * SCALE;

                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1, +1 );
        compute( -1, +1 );
        compute( +1, -1 );
        compute( -1, -1 );

        this.geometry.verticesNeedUpdate = true;
    }

    animate()
    {
        const R2 = this.radiuses[ 2 ];
        const R3 = this.radiuses[ 3 ];

        this.x4 += 0.002;
        if ( this.x4 > R2 + R3 ) this.x4 = -(R2 + R3);

        this.x5 += 0.002;
        if ( this.x5 > R3 ) this.x5 = -R3;
    }

    update()
    {
        if ( this.isVisible() )
        {
            if ( this.type === 0 ) this.crossSectionB1();
            if ( this.type === 1 ) this.crossSectionB2();
            
            this.animate();
        }
    }
}