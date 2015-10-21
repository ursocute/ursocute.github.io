// ******* Flyout MANAGER ******** //
$axure.internal(function($ax) {
    var _flyoutManager = $ax.flyoutManager = {};

    var getFlyoutLabel = function(panelId) {
        return panelId + '_flyout';
    };

    var _unregisterPanel = function(panelId, keepShown) {
        $ax.geometry.unregister(getFlyoutLabel(panelId));
        if(panelToSrc[panelId]) {
            $ax.style.RemoveRolloverOverride(panelToSrc[panelId]);
            delete panelToSrc[panelId];
        }
        if(!keepShown) {
            $ax.action.addAnimation(panelId, function() {
                $ax('#' + panelId).hide();
            });
        }
    };
    _flyoutManager.unregisterPanel = _unregisterPanel;

    var genPoint = $ax.geometry.genPoint;

    var _updateFlyout = function(panelId) {
        var label = getFlyoutLabel(panelId);
        if(!$ax.geometry.polygonRegistered(label)) return;
        var info = $ax.geometry.getPolygonInfo(label);
        var rects = info && info.rects;

        var targetWidget = $ax.getWidgetInfo(panelId);
        rects.target = $ax.geometry.genRect(targetWidget);

        // Src will stay the same, just updating
        $ax.flyoutManager.registerFlyout(rects, panelId, panelToSrc[panelId]);

        if(!$ax.geometry.checkInsideRegion(label)) _unregisterPanel(panelId);
    };
    _flyoutManager.updateFlyout = _updateFlyout;

    var panelToSrc = {};
    var _registerFlyout = function(rects, panelId, srcId) {
        var label = _getFlyoutLabel(panelId);
        var callback = function(info) {
            // If leaving object or already outside it, then unregister, otherwise just return
            if(!info.exiting && !info.outside) return;
            _unregisterPanel(panelId);
        };
        var points = [];

        var lastSrcId = panelToSrc[panelId];
        if(lastSrcId != srcId) {
            if(lastSrcId) $ax.style.RemoveRolloverOverride(lastSrcId);
            if(srcId) {
                $ax.style.AddRolloverOverride(srcId);
                panelToSrc[panelId] = srcId;
            } else delete panelToSrc[panelId];
        }

        // rects should be one or two rectangles
        if(!rects.src) {
            var rect = rects.target;
            points.push(genPoint(rect.Left(), rect.Top()));
            points.push(genPoint(rect.Right(), rect.Top()));
            points.push(genPoint(rect.Right(), rect.Bottom()));
            points.push(genPoint(rect.Left(), rect.Bottom()));
        } else {
            var r0 = rects.src;
            var r1 = rects.target;

            // Right left of right, left right of left, top below top, bottom above bottom
            var rlr = r0.Right() <= r1.right();="" var="" lrl="r0.Left()">= r1.Left();
            var tbt = r0.Top() >= r1.Top();
            var bab = r0.Bottom() </=>