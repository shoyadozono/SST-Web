'use strict';

import { RES_X, RES_Y, NUM_PARTICLES, TORUS_RADIUS, SCALE } from '../Constants.js';
import { SectionBase } from './SectionBase.js';

export class Torus3D extends SectionBase {

    constructor( type = 0 )
    {
        super();

        this.type = type;

        this.radiuses = [ ...Array(3).keys() ].map( (r, i) => {
            return TORUS_RADIUS * Math.pow( 0.5, i + 1 );
        });

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

        this.w0 = -this.radiuses[ 2 ];
        this.ww0 = -this.radiuses[ 2 ];
        this.zz0 = -this.radiuses[ 1 ] - this.radiuses[ 2 ];
        this.zzz0 = -this.radiuses[ 0 ] - this.radiuses[ 1 ];
        this.y0 = -this.radiuses[ 0 ] - this.radiuses[ 1 ] - this.radiuses[ 2 ];
    }

    crossSectionA1A2()
    {
        const rangeT1 =  0;
        const rangeT2 =  Math.PI * 2;
        const rangeS1 = -Math.PI / 2;
        const rangeS2 =  Math.PI / 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        const d = Math.sqrt( R2 * R2 - this.w0 * this.w0 );

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ )
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);

                    const x = (R1 + d * sign) * Math.cos( s ) * Math.cos( t ) * SCALE;
                    const y = (R1 + d * sign) * Math.cos( s ) * Math.sin( t ) * SCALE;
                    const z = (R1 + d * sign) * Math.sin( s ) * SCALE;

                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1 );
        compute( -1 );

        this.geometry.verticesNeedUpdate = true;
    }

    crossSectionA3A4()
    {
        const rangeT1 =  0;
        const rangeT2 =  Math.PI * 2;
        const rangeS1 = -Math.PI / 2;
        const rangeS2 =  Math.PI / 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const x = this.zz0 / Math.tan( s ) * Math.cos( t ) * SCALE;
                    const y = this.zz0 / Math.tan( s ) * Math.sin( t ) * SCALE;
                    const tmp = Math.pow( R2, 2 ) - Math.pow( this.zz0 / Math.sin( s ) - R1, 2 );
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

    crossSectionB1()
    {
        const rangeT1 = 0;
        const rangeT2 = Math.PI * 2;
        const rangeS1 = 0;
        const rangeS2 = Math.PI * 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        const d = Math.sqrt( R2 * R2 - this.ww0 * this.ww0 );

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const x = (R0 + (R1 + d * sign) * Math.cos( t )) * Math.cos( s ) * SCALE;
                    const y = (R0 + (R1 + d * sign) * Math.cos( t )) * Math.sin( s ) * SCALE;
                    const z = (R1 + d * sign) * Math.sin( t ) * SCALE;
                    
                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1 );
        compute( -1 );

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

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const d = Math.sqrt( Math.pow(R1 + R2 * Math.cos( s ), 2) - Math.pow(this.zzz0, 2) );

                    const x =(d * sign + R0) * Math.cos( t ) * SCALE;
                    const y =(d * sign + R0) * Math.sin( t ) * SCALE;
                    const z = R2 * Math.sin( s ) * SCALE;
                    
                    this.geometry.vertices[ j * RES_X + i + NUM_PARTICLES * counter ].set( x, z, y );
                }
            }

            counter++;
        }

        compute( +1 );
        compute( -1 );

        this.geometry.verticesNeedUpdate = true;
    }

    crossSectionB3()
    {
        const rangeT1 = 0;
        const rangeT2 = Math.PI * 2;
        const rangeS1 = 0;
        const rangeS2 = Math.PI * 2;

        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        let counter = 0;

        const compute = ( sign ) =>
        {
            for ( let i = 0; i < RES_X; i++ ) 
            {
                for ( let j = 0; j < RES_Y; j++ ) 
                {
                    const t = rangeT1 + i / RES_X * (rangeT2 - rangeT1);
                    const s = rangeS1 + j / RES_Y * (rangeS2 - rangeS1);
                    
                    const x = this.y0 / Math.tan( s ) * SCALE;
                    const tmp = (1 / Math.cos( t )) * (this.y0 / Math.sin( s ) - R1) - R0;
                    const y = Math.sqrt( R2 * R2 - tmp * tmp ) * SCALE * sign;
                    const z = Math.tan( t ) * (this.y0 / Math.sin( s ) - R1) * SCALE;
                    
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
        const R0 = this.radiuses[ 0 ];
        const R1 = this.radiuses[ 1 ];
        const R2 = this.radiuses[ 2 ];

        this.w0 += 0.005;
        if ( this.w0 > R2 ) this.w0 = -R2;

        this.zz0 += 0.005;
        if ( this.zz0 > R1 + R2 ) this.zz0 = -R1 - R2;

        this.ww0 += 0.005;
        if ( this.ww0 > R2 ) this.ww0 = -R2;

        this.zzz0 += 0.005;
        if ( this.zzz0 > R2 + R1 ) this.zzz0 = -R2 - R1;

        this.y0 += 0.005;
        if ( this.y0 > R0 + R1 + R2 ) this.y0 = -(R0 + R1 + R2);
    }

    update()
    {
        if ( this.isVisible() )
        {
            if ( this.type === 0 ) this.crossSectionA1A2();
            if ( this.type === 1 ) this.crossSectionA3A4();
            if ( this.type === 2 ) this.crossSectionB1();
            if ( this.type === 3 ) this.crossSectionB2();
            if ( this.type === 4 ) this.crossSectionB3();
    
            this.animate();
        }
    }
}