import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  envName: string;
  isFirstLogin: boolean;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    if (this.router.lastSuccessfulNavigation.extras.state) {
      this.isFirstLogin = this.router.lastSuccessfulNavigation.extras.state["isFirstLogin"];
    }
    this.envName = this.commonService.getEnvironment();
  }
}
