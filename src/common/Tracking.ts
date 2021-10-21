import {Options, TrackingHook, useTracking} from "react-tracking";
import {useContext} from "react";
import {UserContext} from "../App";

export default function useDefaultTracking<P = {}>(trackingData?: any, options?: Partial<Options<P>>): TrackingHook<P> {
    const user = useContext(UserContext);
    const extendData = (data: Partial<P>) => ({...data, date: new Date(), user: user?.id ?? "unknown"});
    const extendOptions = (options?: Partial<Options<P>>) => ({...options, dispatchOnMount: true});
    const {Track, trackEvent, getTrackingData} = useTracking<P>(extendData(trackingData), extendOptions(options));
    return {Track: Track, trackEvent: (data) => trackEvent(extendData(data)), getTrackingData: getTrackingData};
}
