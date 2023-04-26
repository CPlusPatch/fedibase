/// <reference path="account.d.ts" />
declare namespace Entity {
    type Report = {
        id: string;
        action_taken: boolean;
        category: Category;
        comment: string;
        forwarded: boolean;
        status_ids: Array<string> | null;
        rule_ids: Array<string> | null;
        target_account?: Account;
    };
    type Category = 'spam' | 'violation' | 'other';
}
