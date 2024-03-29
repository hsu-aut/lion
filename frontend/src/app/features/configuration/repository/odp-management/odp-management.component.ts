import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { take } from 'rxjs';
import { OdpInfo, OdpName } from '@shared/models/odps/odp';
import { OdpService } from '../../../../shared/services/backEnd/odp.service';

@Component({
    selector: 'odp-management',
    templateUrl: './odp-management.component.html',
    styleUrls: ['./odp-management.component.scss']
})
export class OdpManagementComponent implements OnInit {
    // ODPs
    odpInfos = new Array<OdpInfo>();
    odpFormGroup = this.fb.group({});

    constructor(
        private fb: FormBuilder,
        private odpService: OdpService,
    ) {}

    ngOnInit(): void {
        this.odpService.getAllOdps().pipe(take(1)).subscribe(odps => {
            this.odpInfos = odps;
            odps.forEach(odp => {
                this.odpFormGroup.addControl(odp.name, new FormControl(odp.versions[0]));
            });
        });
    }


    /**
     * Loads one ODP with its specified version
     * @param odpName Name of the ODP to load
     */
    loadOdp(odpName: OdpName): void {
        const version = this.odpFormGroup.get(odpName).value;
        this.odpService.loadOdpIntoRepository(odpName, version).pipe(take(1)).subscribe();
    }

    /**
 * Sets all ODPs to their latest version
 */
    setAllVersionsToLatest(): void {
        Object.keys(this.odpFormGroup.controls).forEach(fgKey => {
            // This assumes that latest version is always the first retrieved from Github.
            // This might not always be the case, it might be better to properly sort by tag name
            const latestVersion = this.odpInfos.find(odpInfo => odpInfo.name == fgKey).versions[0];
            this.odpFormGroup.get(fgKey).setValue(latestVersion);
        });
    }

    /**
 * Loads all ODPs with the currently specified versions
 */
    loadAllOdps(): void {
        // Iterate over the form to load every odp with the selected version
        Object.keys(this.odpFormGroup.controls).forEach(fgKey => {
            const odpName = OdpName[fgKey];
            const version = this.odpFormGroup.get(fgKey).value;
            this.odpService.loadOdpIntoRepository(odpName, version).pipe(take(1)).subscribe();
        });
    }

}
