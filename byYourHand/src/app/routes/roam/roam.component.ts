import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-roam',
    templateUrl: './roam.component.html',
  styleUrls: ['./roam.component.css']
})
export class roamComponent implements OnInit {

    levelId: number = 0;
    worldId: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router
  ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            // will get level details from the level service soon
            this.levelId = params['levelId'];
            this.worldId = params['worldId'];
        });
        console.log(this.worldId);
        this.confirmLevelExists();
  }

    confirmLevelExists() {
        if (this.levelId === 0 || this.worldId === 0) // we haven't been provided with a real level
        {
            console.log("re-navigated");
            this.router.navigate(['/error']); // move to service
        }
    }
}
