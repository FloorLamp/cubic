use ic_cdk::api::call::CallResult;
use ic_cdk::export::candid::Principal;
mod futures;

#[export_name = "canister_heartbeat"]
fn heartbeat() {
    futures::spawn(caller());
}

async fn caller() {
    let _result: CallResult<()> = ic_cdk::api::call::call(
        Principal::from_text("bxhqr-vyaaa-aaaah-aaqza-cai").unwrap(),
        "canister_heartbeat",
        ()
    ).await;
}
