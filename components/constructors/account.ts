//This is the constructor - You'll pass your things here.
abstract class Account {
    constructor(
        options: {
			fediType: "misskey" | "pleroma" | "mastodon";
			accountID: string;
		}
    ) {
        this.fediType = options.fediType
        this.accountID = options.accountID
    }

    readonly fediType: "misskey" | "pleroma" | "mastodon";
    readonly accountID: string;

}


export {Account}