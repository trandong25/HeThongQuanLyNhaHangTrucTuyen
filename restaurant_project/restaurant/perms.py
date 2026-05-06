from rest_framework import permissions

class IsApprovedChef(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        is_auth = super().has_permission(request,view)
        return is_auth and request.user.role == 'CHEF' and request.user.is_approved

from rest_framework import permissions

class IsReviewOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return super().has_permission(request, view) and request.user == obj.customer