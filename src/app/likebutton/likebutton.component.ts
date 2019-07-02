import {
  ElementRef,
  HostListener,
  OnInit,
  Input,
  Component,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';
import { Recipe } from '../recipe';
import { switchMap, zip, take } from 'rxjs/operators';
import { UserInfo } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-likebutton',
  templateUrl: './likebutton.component.html',
  styleUrls: ['./likebutton.component.sass'],
})
export class LikeButtonComponent implements OnInit {
  @Input() recipeId: string;
  @Input() likeList: Recipe;
  private item = new Subject();
  private subscription: Subscription;
  private db: AngularFirestore;
  public userSession: UserSessionService;
  destroy$ = new Subject();

  constructor(
    private el: ElementRef,
    afs: AngularFirestore,
    session: UserSessionService,
    private router: Router
  ) {
    this.db = afs;
    this.userSession = session;
  }

  ngOnInit() {
    this.subscription = this.item.asObservable().subscribe((e: any) => {
      this.getItem(e.id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.subscription.unsubscribe();
  }

  getItem(itemId: string) {
    return this.userSession
      .getUserInfoObs()
      .pipe(
        switchMap((user: UserInfo) => {
          if (user === null) {
            throw new Error('AUTH_ERROR');
          }
          return this.db
            .doc('users/' + user.uid)
            .valueChanges()
            .pipe(take(1));
        }),
        zip(
          this.db
            .doc('recipes/' + itemId)
            .valueChanges()
            .pipe(take(1))
        )
      )
      .subscribe(
        (info: any) => {
          const user = info[0];
          const recipe = info[1];
          const userLikeList = user.like ? user.like : {};
          const recipeLikeList = recipe.like ? recipe.like : {};

          // add or remove recipe id in user list
          userLikeList[itemId] ? delete userLikeList[itemId] : (userLikeList[itemId] = true);

          // add or remove user id in recipe
          recipeLikeList[user.uid] ? delete recipeLikeList[user.uid] : (recipeLikeList[user.uid] = true);

          this.db.doc('users/' + user.uid).update({ like: userLikeList });
          this.db.doc('recipes/' + recipe.id).update({ like: recipeLikeList, likeCount: Object.keys(recipeLikeList).length });
        },
        err => {
          console.log(err);
          if (err.message === 'AUTH_ERROR') {
            this.router.navigate(['login']);
          }
        }
      );
  }

  getLength(item) {
    return Object.keys(item).length;
  }

  isLike(obj: object, val: string) {
    if (obj === null || val === null) {
      return false;
    }
    return obj[val] ? true : false;
  }

  @HostListener('click', ['$event.target'])
  onClick(event: Event) {
    this.item.next(event);
  }
}
