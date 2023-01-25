/**
 * Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {CoreModule, HOOK_COMPONENTS} from '@c8y/ngx-components';
import { NgModule } from '@angular/core';
import { GpLibEventChartComponent } from './gp-lib-event-chart.component';
import { ChartsModule } from 'ng2-charts';
import { GpLibEventChartConfig } from './gp-lib-event-chart.config';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import * as preview from './preview-image';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ColorPickerComponent } from './color-picker/color-picker-component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider-component';
import { ColorPaletteComponent } from './color-picker/color-palette/color-palette-component';

@NgModule({
  declarations: [GpLibEventChartComponent, GpLibEventChartConfig, 
    ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  imports: [
    CoreModule,
    ChartsModule,
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [GpLibEventChartComponent, GpLibEventChartConfig, ColorPickerComponent],
  entryComponents: [GpLibEventChartComponent, GpLibEventChartConfig, ColorPickerComponent],
  providers: [
    {
        provide: HOOK_COMPONENTS,
        multi: true,
        useValue: {
            id: 'event chart widget',
            label: 'Event Chart',
            description: 'Event Chart Module',
            previewImage: preview.previewImage,
            component: GpLibEventChartComponent,
            configComponent: GpLibEventChartConfig,
            data : {
                ng1 : {
                    options: {
                        noDeviceTarget: false,
                        noNewWidgets: false,
                        deviceTargetNotRequired: false,
                        groupsSelectable: true
                    }
                }
            }
        }
    }
  ],
})
export class GpLibEventChartModule { }
