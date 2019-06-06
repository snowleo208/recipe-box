import { Directive, ElementRef, HostListener, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';
import { User } from '../user';
import { Recipe } from '../recipe';

@Directive({
    selector: '[like-item]'
})

export class LikeButton implements OnInit {
    @Output() itemInput = new EventEmitter();
    private item = new Subject();
    private subscription: Subscription;
    private db: AngularFirestore;
    private userSession: UserSessionService;
    private userId: BehaviorSubject<string | null> = new BehaviorSubject(null);

    constructor(private el: ElementRef, afs: AngularFirestore, session: UserSessionService) {
        this.db = afs;
        this.userSession = session;
        this.userSession.getUserInfoObs().subscribe(val => val && val.uid ? this.userId.next(val.uid) : false);
    }

    ngOnInit() {
        this.subscription = this.item.subscribe((e: any) => {
            const recipeItem = new BehaviorSubject(null);

            if (this.userId.getValue() !== null) {
                const recipe = this.db.doc('recipes/' + e.id);
                recipe.valueChanges().subscribe((info: Recipe) => recipeItem.getValue() === null ? recipeItem.next(info) : null);

                recipeItem.subscribe(info => {
                    if (!info) { return; }
                    const like = info.like ? info.like : {};
                    const uid = this.userId.getValue();

                    // if already like then remove, else add user id
                    if (!like[uid]) {
                        like[uid] = true;
                    } else {
                        delete like[uid];
                    }

                    recipe.update({ like });
                });

                // edit user info
                this.getItem(e.id);

            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getItem(itemId: string) {
        return this.userId.subscribe((uid: any) => {
            if (uid !== null) {
                const userItem = this.db.doc('users/' + uid);
                const userLatest: BehaviorSubject<User | null> = new BehaviorSubject(null);
                const recipeLatest: BehaviorSubject<Recipe | null> = new BehaviorSubject(null);

                userItem.valueChanges().subscribe((userInfo: User) => userLatest.getValue() === null ? userLatest.next(userInfo) : false);
                this.db.doc('recipes/' + uid).valueChanges().subscribe((recipe: Recipe) =>
                    recipeLatest.getValue() === null ? recipeLatest.next(recipe) : false);

                userLatest.subscribe(info => {
                    if (info === null) { return; }
                    const like = info.like ? info.like : {};

                    // if already like then remove, else add new item id
                    if (!like[itemId]) {
                        like[itemId] = true;
                    } else {
                        delete like[itemId];
                    }

                    userItem.update({ like });
                    // this.db.doc('recipes/' + obj.uid).update({like});
                });
            }
        });
    }

    @HostListener('click', ['$event.target'])
    onClick(event) {
        this.item.next(event);
    }
}